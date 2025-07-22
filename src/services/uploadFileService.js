import api from "./api";

export const uploadFileService = (file, subfolder) => {
    const formData = new FormData();
    formData.append('file', file);
    if (subfolder) {
        formData.append('subfolder', subfolder);
    }
    return api.post('/api/admin/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};