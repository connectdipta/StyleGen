export const getImageUrl = (path, apiUrl) => {
    if (!path || path === 'undefined' || path === 'null') {
        return 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600';
    }

    if (path.startsWith('http')) {
        return path;
    }

    // Handle standard seed names like 'shoes.jpg' or 'belt.jpg'
    if (!path.includes('/')) {
        return `/images/products/${path}`;
    }

    // Handle backend uploads
    if (path.startsWith('/uploads')) {
        return `${apiUrl}${path}`;
    }

    if (path.startsWith('uploads')) {
        return `${apiUrl}/${path}`;
    }

    return path;
};
