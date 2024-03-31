import React, {useState} from 'react';

import '../../css/pages/PostProduct.css';

function PostProduct() {

    const [uploadedImages, setUploadedImages] = useState(Array(16).fill(null));
    const [firstImageUploaded, setFirstImageUploaded] = useState(false);

    const handleImageUpload = (event, index) => {
        const file = event.target.files[0];
        if (file) {
            const updatedImages = [...uploadedImages];
            if (!firstImageUploaded) {
                updatedImages[0] = URL.createObjectURL(file);
                setFirstImageUploaded(true);
            } else {
                let nextAvailableIndex = updatedImages.findIndex(image => image === null);
                if (nextAvailableIndex === -1) {
                    nextAvailableIndex = updatedImages.length;
                }
                updatedImages[nextAvailableIndex] = URL.createObjectURL(file);
            }
            setUploadedImages(updatedImages);
        }
    };
      
    const handleDivClick = (index) => {
        document.getElementById(`fileInput${index}`).click();
    };

    return (
        <div>
            <h1>Post Product</h1>
            <form>
                <div className='content-block'>
                    <div className='content'>
                        <h4>Describe in details*</h4>
                        <label>Enter the name*</label>
                        <input type='text' placeholder='For example, Iphone 11 with warranty' />
                        <div className='chars-info'>
                            Enter at least 16 characters
                            <span>
                                0
                                /
                                70
                            </span>
                        </div>
                        <label>Category*</label>
                        <select></select>
                    </div>
                </div>
                <div className='content-block'>
                    <div className='content'>
                        <h4>Picture</h4>
                        <label>First picture will be the cover for your posting. Drag to pictures to change order.</label>
                        <div className='image-container'>
                            {uploadedImages.map((imagePath, index) => (
                                <div key={index} className='image-input' onClick={() => handleDivClick(index)}>
                                    {index === 0 && firstImageUploaded && <div className='first-image-label'>First Image</div>}
                                    {imagePath && (
                                        <img src={imagePath} alt={`Image ${index + 1}`} />
                                    )}
                                    <input
                                        type='file'
                                        id={`fileInput${index}`}
                                        accept='image/*'
                                        onChange={(e) => handleImageUpload(e, index)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className='content-block'>
                    <div className='content'>
                        <h4>Description</h4>
                        <label>Enter the description*</label>
                        <textarea type='text' placeholder='Think of what would you like to know from posting and add it to the description' />
                        <div className='chars-info'>
                            Enter at least 40 characters
                            <span>
                                0
                                /
                                9000
                            </span>
                        </div>
                    </div>
                </div>
                <div className='content-block'>
                    <div className='content'>
                        <h4>Location</h4>
                        <label>Choose the location*</label>
                        <select></select>
                    </div>
                </div>
                <div className='content-block'>
                    <div className='content'>
                        <h4>Contact information</h4>
                        <label>Contact person*</label>
                        <input type='text' />
                        <label>Email address</label>
                        <input type='text' />
                        <label>Phone number</label>
                        <input type='text' />
                    </div>
                </div>
                <div className='content-block'>
                    <div className='content'>
                        <div className='button-group'>
                            <button className='button-post'>Post Product</button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default PostProduct;
