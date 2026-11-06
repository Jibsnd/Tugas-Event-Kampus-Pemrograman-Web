import { useEffect, useState } from 'react'
import { Link, Route, Routes, useNavigate, useParams } from 'react-router'
import './App.css'

const contoh = [
  { id: '1', title: 'Seminar AI Kampus', startDate: '2026-11-12', endDate: '', untilFinished: true, startTime: '09:00', endTime: '', location: 'Fasilkom-TI' },
  { id: '2', title: 'Workshop React', startDate: '2026-11-20', endDate: '2026-11-21', untilFinished: false, startTime: '13:00', endTime: '16:00', location: 'Lab Komputer' },
]

// Fungsi bantu untuk memformat tampilan jadwal
function formatJadwal(event) {
  let dateStr = event.startDate || event.date; // fallback ke data lama
  if (event.untilFinished) {
    dateStr += ' s/d selesai';
  } else if (event.endDate && event.endDate !== event.startDate) {
    dateStr += ` s/d ${event.endDate}`;
  }

  let timeStr = '';
  if (event.startTime) {
    timeStr = event.startTime;
    if (event.endTime && !event.untilFinished) {
      timeStr += ` - ${event.endTime}`;
    }
  }

  return `${dateStr}${timeStr ? ` • 🕒 ${timeStr}` : ''}`;
}

function DaftarEvent({ events, onAdd, onDelete }) {
  const [title, setTitle] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [untilFinished, setUntilFinished] = useState(false)
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [location, setLocation] = useState('')
  
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const [showConfirm, setShowConfirm] = useState(false)
  const [pendingEvent, setPendingEvent] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [eventToDelete, setEventToDelete] = useState(null)

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim() || !startDate || !location.trim()) {
      setError('Nama acara, tanggal mulai, dan lokasi wajib diisi.')
      return
    }
    setPendingEvent({ 
      id: crypto.randomUUID(), 
      title: title.trim(), 
      startDate, 
      endDate: untilFinished ? '' : endDate, 
      untilFinished, 
      startTime, 
      endTime: untilFinished ? '' : endTime, 
      location: location.trim() 
    })
    setShowConfirm(true)
    setError('')
  }

  function confirmAdd() {
    onAdd(pendingEvent)
    setTitle(''); setStartDate(''); setEndDate(''); setUntilFinished(false);
    setStartTime(''); setEndTime(''); setLocation('')
    setShowConfirm(false); setPendingEvent(null)
  }

  function cancelAdd() { setShowConfirm(false); setPendingEvent(null) }
  function handleDeleteClick(event) { setEventToDelete(event); setShowDeleteConfirm(true) }
  function confirmDelete() { if (eventToDelete) onDelete(eventToDelete.id); setShowDeleteConfirm(false); setEventToDelete(null) }
  function cancelDelete() { setShowDeleteConfirm(false); setEventToDelete(null) }

  return (
    <section className="page-section">
      <div className="section-header">
        <h2>Daftar Acara Kampus ({events.length})</h2>
      </div>

      <form className="card event-form" onSubmit={handleSubmit}>
        <h3>Tambah Acara Baru</h3>
        <div className="form-group-grid">
          <input className="full-width" aria-label="Nama acara" value={title} onChange={e => setTitle(e.target.value)} placeholder="Nama acara" />
          
          <div className="input-with-label">
            <label>Tanggal Mulai</label>
            <input aria-label="Tanggal mulai" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
          </div>
          
          {!untilFinished && (
            <div className="input-with-label">
              <label>Tanggal Selesai (Opsional)</label>
              <input aria-label="Tanggal selesai" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} min={startDate} />
            </div>
          )}

          <div className="input-with-label">
            <label>Jam Mulai</label>
            <input aria-label="Jam mulai" type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
          </div>

          {!untilFinished && (
            <div className="input-with-label">
              <label>Jam Selesai</label>
              <input aria-label="Jam selesai" type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />
            </div>
          )}

          <label className="checkbox-label full-width">
            <input type="checkbox" checked={untilFinished} onChange={e => setUntilFinished(e.target.checked)} />
            Jadwal berlaku "s/d selesai" (Abaikan tanggal & jam akhir)
          </label>

          <input className="full-width" aria-label="Lokasi acara" value={location} onChange={e => setLocation(e.target.value)} placeholder="Lokasi" />
          
          <button type="submit" className="btn-primary full-width mt-2">Tambah acara</button>
        </div>
        {error && <p className="error-text" role="alert">{error}</p>}
      </form>

      <div className="event-list">
        {events.length === 0 && <p className="empty-state">Belum ada acara. Silakan tambahkan jadwal baru.</p>}
        {events.map(event => (
          <div className="card event-card" key={event.id}>
            <div className="event-info">
              <Link to={`/event/${event.id}`} className="event-title">{event.title}</Link>
              <p className="event-meta">📅 {formatJadwal(event)}</p>
              <p className="event-meta">📍 {event.location}</p>
            </div>
            <div className="event-actions">
              <button className="btn-secondary" onClick={() => navigate(`/edit/${event.id}`)}>Edit</button>
              <button className="btn-danger" onClick={() => handleDeleteClick(event)}>Hapus</button>
            </div>
          </div>
        ))}
      </div>

      {showConfirm && (
        <div className="modal-overlay"><div className="modal-content">
          <h3>Konfirmasi Penambahan</h3>
          <p>Tambahkan acara <strong>{pendingEvent?.title}</strong> ke jadwal?</p>
          <div className="modal-actions">
            <button onClick={cancelAdd} className="btn-secondary">Batal</button>
            <button onClick={confirmAdd} className="btn-primary">Ya, Tambahkan</button>
          </div>
        </div></div>
      )}
      {showDeleteConfirm && (
        <div className="modal-overlay"><div className="modal-content">
          <h3>Konfirmasi Penghapusan</h3>
          <p>Hapus acara <strong>{eventToDelete?.title}</strong>? Tindakan ini permanen.</p>
          <div className="modal-actions">
            <button onClick={cancelDelete} className="btn-secondary">Batal</button>
            <button onClick={confirmDelete} className="btn-danger">Ya, Hapus</button>
          </div>
        </div></div>
      )}
    </section>
  )
}

function EditEvent({ events, onUpdate }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const event = events.find(item => item.id === id)
  
  const [title, setTitle] = useState(event?.title || '')
  const [startDate, setStartDate] = useState(event?.startDate || event?.date || '')
  const [endDate, setEndDate] = useState(event?.endDate || '')
  const [untilFinished, setUntilFinished] = useState(event?.untilFinished || false)
  const [startTime, setStartTime] = useState(event?.startTime || '')
  const [endTime, setEndTime] = useState(event?.endTime || '')
  const [location, setLocation] = useState(event?.location || '')
  const [error, setError] = useState('')
  const [showEditConfirm, setShowEditConfirm] = useState(false)

  if (!event) return <p className="empty-state">Acara tidak ditemukan. <Link to="/">Kembali</Link></p>

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim() || !startDate || !location.trim()) {
      setError('Nama, tanggal mulai, dan lokasi wajib diisi.')
      return
    }
    setShowEditConfirm(true)
    setError('')
  }

  function confirmEdit() {
    onUpdate({ id, title: title.trim(), startDate, endDate: untilFinished ? '' : endDate, untilFinished, startTime, endTime: untilFinished ? '' : endTime, location: location.trim() })
    setShowEditConfirm(false)
    navigate('/')
  }

  return (
    <section className="page-section">
      <h2>Edit Acara</h2>
      <form className="card event-form" onSubmit={handleSubmit}>
        <div className="form-group-grid">
          <input className="full-width" value={title} onChange={e => setTitle(e.target.value)} placeholder="Nama acara" />
          
          <div className="input-with-label"><label>Tanggal Mulai</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
          </div>
          {!untilFinished && (
            <div className="input-with-label"><label>Tanggal Selesai</label>
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} min={startDate} />
            </div>
          )}
          
          <div className="input-with-label"><label>Jam Mulai</label>
            <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
          </div>
          {!untilFinished && (
            <div className="input-with-label"><label>Jam Selesai</label>
              <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />
            </div>
          )}

          <label className="checkbox-label full-width">
            <input type="checkbox" checked={untilFinished} onChange={e => setUntilFinished(e.target.checked)} />
            Jadwal berlaku "s/d selesai"
          </label>

          <input className="full-width" value={location} onChange={e => setLocation(e.target.value)} placeholder="Lokasi" />
        </div>
        <div className="form-actions mt-2">
          <button type="submit" className="btn-primary">Simpan Perubahan</button>
          <button type="button" className="btn-secondary" onClick={() => navigate('/')}>Batal</button>
        </div>
        {error && <p className="error-text" role="alert">{error}</p>}
      </form>
      {showEditConfirm && (
        <div className="modal-overlay"><div className="modal-content">
          <h3>Konfirmasi Perubahan</h3>
          <p>Simpan perubahan pada acara <strong>{title}</strong>?</p>
          <div className="modal-actions">
            <button type="button" onClick={() => setShowEditConfirm(false)} className="btn-secondary">Batal</button>
            <button type="button" onClick={confirmEdit} className="btn-primary">Ya, Simpan</button>
          </div>
        </div></div>
      )}
    </section>
  )
}

function DetailEvent({ events }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const event = events.find(item => item.id === id)
  
  if (!event) return <p className="empty-state">Acara tidak ditemukan. <Link to="/">Kembali</Link></p>
  
  return (
    <section className="card detail-section">
      <h2>{event.title}</h2>
      <p className="event-meta">📅 Waktu: {formatJadwal(event)}</p>
      <p className="event-meta">📍 Lokasi: {event.location}</p>
      <div className="form-actions" style={{ marginTop: '20px' }}>
        <button className="btn-secondary" onClick={() => navigate(`/edit/${event.id}`)}>Edit Acara</button>
        <button className="btn-primary" onClick={() => navigate('/')}>Kembali ke daftar</button>
      </div>
    </section>
  )
}

function Tentang() {
  return (
    <section className="card">
      <h2>Tentang Aplikasi</h2>
      <p>Aplikasi penjadwalan sederhana untuk mengelola event kampus. Dibangun menggunakan React Hooks & Routing.</p>
    </section>
  )
}

function NotFound() { return <p className="empty-state">404 - Halaman tidak ditemukan. <Link to="/">Kembali</Link></p> }

export default function App() {
  // Tema (Dark Mode)
  const [theme, setTheme] = useState(() => localStorage.getItem('app-theme') || 'light')

  useEffect(() => {
    document.body.className = theme
    localStorage.setItem('app-theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light')

  // Events state
  const [events, setEvents] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('event-kampus-v2'))
      return Array.isArray(saved) ? saved : contoh
    } catch { return contoh }
  })

  useEffect(() => {
    localStorage.setItem('event-kampus-v2', JSON.stringify(events))
  }, [events])

  function addEvent(event) { setEvents(prev => [...prev, event]) }
  function deleteEvent(id) { setEvents(prev => prev.filter(event => event.id !== id)) }
  function updateEvent(updatedEvent) { setEvents(prev => prev.map(event => event.id === updatedEvent.id ? updatedEvent : event)) }

  return (
    <main className="app-container">
      <header className="app-header">
        <div className="header-top">
          <h1>🎓 Sistem Event Kampus</h1>
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>
        <nav className="app-nav">
          <Link to="/">Daftar Event</Link>
          <Link to="/tentang">Tentang</Link>
        </nav>
      </header>
      
      <div className="app-content">
        <Routes>
          <Route path="/" element={<DaftarEvent events={events} onAdd={addEvent} onDelete={deleteEvent} />} />
          <Route path="/event/:id" element={<DetailEvent events={events} />} />
          <Route path="/edit/:id" element={<EditEvent events={events} onUpdate={updateEvent} />} />
          <Route path="/tentang" element={<Tentang />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </main>
  )
}