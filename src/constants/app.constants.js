/* eslint-disable no-undef */
export const APP_INFO = {
  NAME: 'AloZola',
  VERSION: '1.0.0',
  AUTHOR: 'Alo Zola',
  DESCRIPTION:
    'Alo Zola is a social media platform that allows you to connect with your friends and family.',
  COPYRIGHT: '© 2025 Alo Zola. All rights reserved.',
  LICENSE: 'MIT'
}
export const SECONDS_GROUP_IMAGES = 3000 // 3 seconds

let apiRoot = ''
let apiSocketRoot = ''
console.log('import.meta.env', import.meta.env)
if (import.meta.env.DEV) {
  apiRoot = 'http://127.0.0.1:8022/api/v1'
  apiSocketRoot = 'http://127.0.0.1:8022'
}

if (import.meta.env.PROD) {
  apiRoot = 'https://alozola-api.onrender.com/api/v1'
  apiSocketRoot = 'https://alozola-api.onrender.com'
}

export const API_URL_8022 = apiRoot
export const API_SOCKET_URL = apiSocketRoot
// export const API_SOCKET_URL = 'https://alozola-api.onrender.com'
