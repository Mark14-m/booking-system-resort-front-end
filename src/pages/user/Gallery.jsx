import React from 'react'

function Gallery() {
  return (
    <section id="gallery" className="py-5">
            <div className="container py-4">
                <div className="text-center mb-5">
                    <h2 className="h1 fw-bold mb-3">Resort Gallery</h2>
                    <p className="text-muted mx-auto fs-5" style={{ maxWidth: "800px" }}>
                        Explore the beauty and luxury of our resort through our gallery
                    </p>
                    <div className="divider-primary mx-auto mt-3"></div>
                </div>

                <div className="row g-4">
                    {Array.from({ length: 15 }, (_, index) => (
                        <div key={index} className="col-6 col-md-4 col-lg-3">
                            <div
                                className="position-relative rounded-4 overflow-hidden shadow-sm"
                                style={{ height: "240px" }}
                            >
                                <img
                                    src={`/assets/img/projectImgs/img_${index + 1}.jpg`}
                                    alt={`Gallery image ${index + 1}`}
                                    className="w-100 h-100"
                                    style={{ objectFit: "cover" }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
  )
}

export default Gallery