'use server'

import { errorHandler } from "@/helpers"
import prismadb from "@/lib/prismadb"

export default async function updateStatus(id:string) {
  try {
    const response = await prismadb.invitedUser.update({
      where:{
        id
      },data:{
        status:'COMPLETED'
      }
    })
    if(!response){
      return {error:'somthing went wrong'}
    }
    return {success:'Congratulation'}
  } catch (error) {
    errorHandler(error)
  }
  
}