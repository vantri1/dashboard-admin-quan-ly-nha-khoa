import api from "./api";

export const uploadFileService = (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/api/admin/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};