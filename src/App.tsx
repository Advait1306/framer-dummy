import './index.css'

const components = [
  { name: 'ExampleButton', path: 'example-button' },
  { name: 'IPhoneVideoCard', path: 'iphone-video-card' },
  { name: 'IPhoneVideoGallery', path: 'iphone-video-gallery' },
]

const pages = [
  { name: 'Gallery Page', path: 'gallery-page' },
]

function App() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Components</h1>
      <ul style={styles.list}>
        {components.map((item) => (
          <li key={item.name} style={styles.item}>
            <a href={`#/${item.path}`} style={styles.link}>
              {item.name}
            </a>
          </li>
        ))}
      </ul>

      <h1 style={{ ...styles.title, marginTop: '48px' }}>Pages</h1>
      <ul style={styles.list}>
        {pages.map((item) => (
          <li key={item.name} style={styles.item}>
            <a href={`#/${item.path}`} style={styles.link}>
              {item.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    padding: '60px 40px',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 600,
    color: '#1a1a1a',
    marginBottom: '24px',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  item: {
    marginBottom: '12px',
  },
  link: {
    fontSize: '1rem',
    color: '#0066ff',
    textDecoration: 'none',
  },
}

export default App
