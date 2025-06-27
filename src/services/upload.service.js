export const uploadService = {
    uploadImg,
    uploadFile,
    uploadMultipleFiles
}

// Configuration - You can move these to environment variables
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dpudc8qus'
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'Tasklo'
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`
const RAW_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`

async function uploadImg(ev) {
    //* Defining our variables
    const FORM_DATA = new FormData()
    //* Building the request body
    FORM_DATA.append('file', ev.target.files[0])
    FORM_DATA.append('upload_preset', UPLOAD_PRESET)
    //* Sending a post method request to Cloudinary API
    try {
        const res = await fetch(UPLOAD_URL, { method: 'POST', body: FORM_DATA, })
        const imgData = await res.json()
        return imgData
    } catch (err) {
        console.error(err)
        throw err
    }
}

async function uploadFile(file, options = {}) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', UPLOAD_PRESET)

    // Add optional parameters
    if (options.folder) {
        formData.append('folder', options.folder)
    }
    if (options.public_id) {
        formData.append('public_id', options.public_id)
    }
    if (options.tags) {
        formData.append('tags', options.tags.join(','))
    }

    // Determine upload URL based on file type
    const isImage = file.type.startsWith('image/')
    const uploadUrl = isImage ? UPLOAD_URL : RAW_UPLOAD_URL

    try {
        const response = await fetch(uploadUrl, {
            method: 'POST',
            body: formData
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.error?.message || `Upload failed: ${response.statusText}`)
        }

        const result = await response.json()

        // Return standardized format for attachments
        return {
            id: result.public_id,
            url: result.secure_url,
            originalName: file.name,
            size: result.bytes,
            type: isImage ? 'image' : 'file',
            mimeType: file.type,
            width: result.width || null,
            height: result.height || null,
            createdAt: Date.now(),
            cloudinaryData: result // Keep full Cloudinary response
        }
    } catch (error) {
        console.error('Upload error:', error)
        throw new Error(`Failed to upload file: ${error.message}`)
    }
}

async function uploadMultipleFiles(files, options = {}) {
    const uploadPromises = Array.from(files).map(file => uploadFile(file, options))

    try {
        const results = await Promise.all(uploadPromises)
        return results
    } catch (error) {
        console.error('Multiple upload error:', error)
        throw error
    }
}

// Helper function to validate file types and sizes
export function validateFile(file, maxSizeMB = 10, allowedTypes = []) {
    const maxSizeBytes = maxSizeMB * 1024 * 1024

    if (file.size > maxSizeBytes) {
        throw new Error(`File size must be less than ${maxSizeMB}MB`)
    }

    if (allowedTypes.length > 0 && !allowedTypes.some(type => file.type.includes(type))) {
        throw new Error(`File type not allowed. Allowed types: ${allowedTypes.join(', ')}`)
    }

    return true
}

// Helper function to format file size
export function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}