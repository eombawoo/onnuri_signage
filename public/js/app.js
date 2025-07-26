document.addEventListener('DOMContentLoaded', () => {
    const imageContainer = document.getElementById('image-container');
    const textOverlay = document.getElementById('text-overlay');
    const currentImageElement = document.getElementById('current-image');
    const currentTextElement = document.getElementById('current-text');
    const nextImageElement = document.getElementById('next-image');
    const nextTextElement = document.getElementById('next-text');

    let images = [];
    let currentImageIndex = 0;
    let textVisible = false;
    let slideshowInterval;
    let textInterval;

    // Function to fetch images from images.json
    async function fetchImages() {
        try {
            const response = await fetch('data/images.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            images = await response.json();
            console.log('Images loaded:', images);
            if (images.length > 0) {
                preloadImages();
                startSlideshow();
            } else {
                console.warn('No images found in images.json');
            }
        } catch (error) {
            console.error('Error fetching images:', error);
            imageContainer.innerHTML = `<p style="color: white; text-align: center;">이미지를 불러오는 데 실패했습니다. 파일을 확인해주세요: ${error.message}</p>`;
        }
    }

    // Preload images
    function preloadImages() {
        images.forEach(image => {
            const img = new Image();
            img.src = image.filename;
        });
    }

    // Function to update the image and text
    function updateContent() {
        if (images.length === 0) return;

        const currentImage = images[currentImageIndex];
        const nextImageIndex = (currentImageIndex + 1) % images.length;
        const nextImage = images[nextImageIndex];

        // Set current content
        currentImageElement.src = currentImage.filename;
        currentTextElement.textContent = currentImage.text;

        // Set next content for preloading/display
        nextImageElement.src = nextImage.filename;
        nextTextElement.textContent = nextImage.text;

        // Reset text overlay visibility
        textOverlay.style.opacity = 0;
        textVisible = false;

        // Start text display timer
        clearInterval(textInterval);
        textInterval = setTimeout(() => {
            textOverlay.style.opacity = 1;
            textVisible = true;
        }, 8 * 1000); // Show text after 8 seconds

        currentImageIndex = nextImageIndex;
    }

    // Start the slideshow
    function startSlideshow() {
        if (images.length === 0) return;
        updateContent(); // Display first image immediately
        slideshowInterval = setInterval(updateContent, 10 * 1000); // Change image every 10 seconds
    }

    // Initialize
    fetchImages();
});