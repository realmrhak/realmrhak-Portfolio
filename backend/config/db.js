import mongoose from 'mongoose'

/**
 * Connect to MongoDB.
 * Uses Mongoose's built-in connection pool & retry logic.
 */
export async function connectDB() {
  const uri = process.env.MONGODB_URI

  if (!uri) {
    console.error('\n[db] MONGODB_URI is not set in backend/.env')
    console.error('[db] Fix: copy .env.example to .env and set MONGODB_URI.')
    console.error('[db]   For Atlas:    mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/portfolio')
    console.error('[db]   For local:    mongodb://127.0.0.1:27017/portfolio\n')
    process.exit(1)
  }

  mongoose.set('strictQuery', true)

  // Register listeners BEFORE attempting to connect so we never miss an
  // error event emitted between connect() resolving and listener setup.
  mongoose.connection.on('error', (err) => {
    console.error('[db] MongoDB runtime error:', err.message)
  })

  mongoose.connection.on('disconnected', () => {
    console.warn('[db] MongoDB disconnected')
  })

  mongoose.connection.on('reconnected', () => {
    console.info('[db] MongoDB reconnected')
  })

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
      maxPoolSize: 10,
    })
    console.log(`[db] MongoDB connected: ${conn.connection.host}/${conn.connection.name}`)
  } catch (err) {
    console.error('\n[db] MongoDB connection error:', err.message)
    console.error('\n[db] === TROUBLESHOOTING ===')
    if (err.message.includes('querySrv') || err.message.includes('ECONNREFUSED')) {
      console.error('[db] DNS / network cannot reach the cluster. Common causes:')
      console.error('[db]   1. Atlas Network Access: add IP 0.0.0.0/0 (allow from anywhere)')
      console.error('[db]   2. Your ISP/router blocks DNS SRV records → use Google DNS 8.8.8.8 or Cloudflare 1.1.1.1')
      console.error('[db]   3. VPN / proxy / antivirus blocking → disable temporarily')
      console.error('[db]   4. Atlas cluster paused → Resume it in the Atlas dashboard')
      console.error('[db]   5. Use a non-SRV connection string from Atlas Connect → Drivers')
      console.error('[db]   6. Use a local MongoDB:  MONGODB_URI=mongodb://127.0.0.1:27017/portfolio')
      console.error('\n[db] Run "npm run diag" for a detailed diagnosis.\n')
    } else if (err.message.includes('authentication failed')) {
      console.error('[db] Wrong username or password in MONGODB_URI.')
      console.error('[db] In Atlas → Database Access → reset password, then update .env\n')
    } else if (err.message.includes('server selection')) {
      console.error('[db] Cluster reachable but no server selected in time.')
      console.error('[db] Atlas may be paused or your IP may not be whitelisted.\n')
    }
    process.exit(1)
  }
}
