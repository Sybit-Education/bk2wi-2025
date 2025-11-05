import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { JwtService } from '@/services/jwtService'
import { UserInfoService } from '@/services/userInfoService'
import type { UserInfo } from '@/models/userInfo'

const TOKEN_KEY = 'auth_token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const USER_KEY = 'auth_user'

export const useAuthStore = defineStore('auth', () => {
  const jwtService = new JwtService()
  const userService = new UserInfoService()
  
  // State
  const accessToken = ref<string | null>(localStorage.getItem(TOKEN_KEY))
  const refreshToken = ref<string | null>(localStorage.getItem(REFRESH_TOKEN_KEY))
  const csrfToken = ref<string | null>(localStorage.getItem('csrf_token'))
  const user = ref<UserInfo | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // Beim Start versuchen, den Benutzer aus dem localStorage zu laden
  try {
    const storedUser = localStorage.getItem(USER_KEY)
    if (storedUser) {
      user.value = JSON.parse(storedUser)
    }
  } catch (e) {
    console.error('Fehler beim Laden des Benutzers aus dem localStorage:', e)
  }
  
  // Computed
  const isAuthenticated = computed(() => !!accessToken.value && !!user.value)
  const username = computed(() => user.value?.username || '')
  
  // Actions
  async function login(email: string, password: string): Promise<boolean> {
    loading.value = true
    error.value = null
    
    try {
      const loggedInUser = await userService.loginUser(email, password)
      
      if (!loggedInUser) {
        error.value = 'Ungültige Anmeldedaten'
        return false
      }
      
      // Token generieren
      const tokens = jwtService.generateTokens(loggedInUser)
      
      // Token und Benutzer speichern
      accessToken.value = tokens.accessToken
      refreshToken.value = tokens.refreshToken
      csrfToken.value = tokens.csrfToken
      user.value = loggedInUser
      
      // CSRF-Token im localStorage speichern
      localStorage.setItem('csrf_token', tokens.csrfToken)
      
      // Im localStorage speichern - nur notwendige Informationen, keine sensiblen Daten
      localStorage.setItem(TOKEN_KEY, tokens.accessToken)
      localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken)
      
      // Nur nicht-sensible Benutzerdaten speichern
      const safeUserData = {
        id: loggedInUser.id,
        username: loggedInUser.username,
        email: loggedInUser.email
      }
      localStorage.setItem(USER_KEY, JSON.stringify(safeUserData))
      
      return true
    } catch (e) {
      console.error('Login-Fehler:', e)
      error.value = 'Bei der Anmeldung ist ein Fehler aufgetreten'
      return false
    } finally {
      loading.value = false
    }
  }
  
  function logout() {
    // Token und Benutzer entfernen
    accessToken.value = null
    refreshToken.value = null
    csrfToken.value = null
    user.value = null
    
    // Aus dem localStorage entfernen
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem('csrf_token')
  }
  
  async function refreshTokens(): Promise<boolean> {
    if (!refreshToken.value) {
      return false
    }
    
    try {
      const result = jwtService.refreshAccessToken(refreshToken.value)
      
      if (!result) {
        logout()
        return false
      }
      
      accessToken.value = result.accessToken
      localStorage.setItem(TOKEN_KEY, result.accessToken)
      
      return true
    } catch (e) {
      console.error('Token-Refresh-Fehler:', e)
      logout()
      return false
    }
  }
  
  async function checkAndRefreshToken(): Promise<boolean> {
    if (!accessToken.value) {
      return false
    }
    
    // Token überprüfen
    const decoded = jwtService.verifyToken(accessToken.value)
    
    if (decoded) {
      return true
    }
    
    // Token ist abgelaufen, versuchen zu erneuern
    return await refreshTokens()
  }
  
  return {
    accessToken,
    csrfToken,
    user,
    loading,
    error,
    isAuthenticated,
    username,
    login,
    logout,
    refreshTokens,
    checkAndRefreshToken
  }
})
