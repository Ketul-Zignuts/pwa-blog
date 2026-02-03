export interface UserProfile {
    success: boolean
    user: UserDataTypes
    token: string
}

export interface UserDataTypes {
    uid: string
    email: string
    displayName?: string
    photoURL?: string
    phoneNumber?: string
    bio?: string
    isadmin: boolean
    isroadmin: boolean
    totalposts?: number
    followers?: number
    following?: number
    created_at: string
    updated_at: string
}

export interface SupabaseUser extends UserProfile {
    id: string
}