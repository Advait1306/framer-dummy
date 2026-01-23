import { IPhoneVideoGallery } from "../components/iPhoneVideoGallery"

export function GalleryPage() {
  return (
    <div style={{ width: "100vw", backgroundColor: "#fcfcfa" }}>
      <div style={{ height: "200vh", padding: 40 }}>
        <p style={{ color: "#999", fontSize: 18 }}>Scroll down to see the component</p>
      </div>
      <div style={{ height: "100vh" }}>
        <IPhoneVideoGallery />
      </div>
      <div style={{ height: "200vh" }} />
    </div>
  )
}
