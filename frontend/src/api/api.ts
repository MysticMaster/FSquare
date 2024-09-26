export const authApi = {
    login: "/auth/admin/v1/authentications"
}
export const adminApi = {
    getProfile:"/api/admin/v1/admins/profile"
}
export const brandApi ={
    create:"/api/admin/v1/brands",
    getAll:"/api/admin/v1/brands",
    getById:"/api/admin/v1/brands",
    update:"/api/admin/v1/brands",
}
export const categoryApi = {
    create:"/api/admin/v1/categories",
    getAll:"/api/admin/v1/categories",
    getById:"/api/admin/v1/categories",
    update:"/api/admin/v1/categories",
}
export const shoesApi = {
    create:"/api/admin/v1/shoes",
    getAll:"/api/admin/v1/shoes",
    getById:"/api/admin/v1/shoes",
    update:"/api/admin/v1/shoes",
}
export const classificationApi = {
    create:"/api/admin/v1/classifications",
    getByShoesId:"/api/admin/v1/classifications/shoes",
    getById:"/api/admin/v1/classifications",
    update:"/api/admin/v1/classifications",
    updateMedia:"/api/admin/v1/classifications/media",
    deleteMedia:"/api/admin/v1/classifications/media",
}
export const sizeApi={
    create:"/api/admin/v1/size",
    getByClassificationId:"/api/admin/v1/size/classifications",
    getById:"/api/admin/v1/size",
    update:"/api/admin/v1/size",
}
