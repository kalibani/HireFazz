'use server'
 
import { cookies } from 'next/headers'
 
const changeLang = (lang: 'id' | 'en') => {
  cookies().set('lang', lang)
}

export default changeLang