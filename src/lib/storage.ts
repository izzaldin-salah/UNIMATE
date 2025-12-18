import { supabase } from './supabase'

/**
 * Upload a PDF file to Supabase Storage
 * @param file - The PDF file to upload
 * @param subjectName - The subject name for organizing files
 * @returns The public URL of the uploaded file or null if error
 */
export async function uploadPDF(file: File, subjectName: string): Promise<string | null> {
  try {
    // Generate unique file name
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `${subjectName}/${fileName}`

    // Upload file to storage
    const { data, error } = await supabase.storage
      .from('pdfs')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      console.error('Error uploading file:', error)
      return null
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('pdfs')
      .getPublicUrl(data.path)

    return publicUrl
  } catch (error) {
    console.error('Error in uploadPDF:', error)
    return null
  }
}

/**
 * Get all PDFs for a specific subject
 * @param subjectName - The subject name
 * @returns Array of file objects with name and URL
 */
export async function getSubjectPDFs(subjectName: string) {
  try {
    const { data, error } = await supabase.storage
      .from('pdfs')
      .list(subjectName, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' },
      })

    if (error) {
      console.error('Error fetching PDFs:', error)
      return []
    }

    // Get public URLs for all files
    const files = data.map((file) => {
      const { data: { publicUrl } } = supabase.storage
        .from('pdfs')
        .getPublicUrl(`${subjectName}/${file.name}`)

      return {
        name: file.name,
        url: publicUrl,
        createdAt: file.created_at,
        size: file.metadata?.size || 0,
      }
    })

    return files
  } catch (error) {
    console.error('Error in getSubjectPDFs:', error)
    return []
  }
}

/**
 * Delete a PDF file from storage
 * @param subjectName - The subject name
 * @param fileName - The file name
 * @returns true if successful, false otherwise
 */
export async function deletePDF(subjectName: string, fileName: string): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from('pdfs')
      .remove([`${subjectName}/${fileName}`])

    if (error) {
      console.error('Error deleting file:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error in deletePDF:', error)
    return false
  }
}
