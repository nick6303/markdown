import { ref } from 'vue/'

import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import utilsApi from '@api/utils'

function usePDF(element = null) {
  const pdf = ref(null)
  const imgWidth = 595
  const setPDF = async (target, info = null) => {
    let watermark, context
    if (info) {
      let text = ''
      Object.keys(info).forEach((key) => {
        text += info[key] + ' '
      })
      watermark = document.createElement('canvas')
      watermark.width = 595
      watermark.height = 210
      context = watermark.getContext('2d')
      context.font = '30px sans-serif'
      context.textAlign = 'left'
      context.letterSpacing = '2px'
      context.textAlign = 'center'
      context.rotate((-10 * Math.PI) / 180)
      context.strokeStyle = '#ededed'
      context.strokeText(
        text,
        (watermark.width * 9) / 18,
        (watermark.height * 15) / 18
      )
    }
    try {
      pdf.value = new jsPDF('', 'pt', 'a4')
      const canvas = await html2canvas(target, {
        backgroundColor: null,
        // dpi: window.devicePixelRatio * 4,
        // scale: 4,
        useCORS: true,
      })

      const pageData = canvas.toDataURL('image/PNG', 1.0)
      const imgHeight = (595 / canvas.width) * canvas.height
      const pageHeight = (canvas.width / 595) * 842
      let leftHeight = canvas.height
      let position = 0
      while (leftHeight > 0) {
        if (info) {
          const watermarkData = watermark.toDataURL()
          pdf.value.addImage(watermarkData, 'JPEG', 0, position, 575, 210)
          pdf.value.addImage(watermarkData, 'JPEG', 0, position + 210, 575, 210)
          pdf.value.addImage(watermarkData, 'JPEG', 0, position + 420, 575, 210)
          pdf.value.addImage(watermarkData, 'JPEG', 0, position + 630, 575, 210)
        }
        pdf.value.addImage(pageData, 'PNG', 0, position, imgWidth, imgHeight)
        leftHeight -= pageHeight
        position -= 842
        if (leftHeight > 0) {
          pdf.value.addPage()
        }
      }
    } catch {
      // pass
    }
  }

  const getPDF = async (fileName, info) => {
    try {
      await setPDF(element.value, info)
      const myblob = pdf.value.output('blob')
      const file = new File([myblob], fileName, {
        type: 'application/pdf',
      })
      let form = new FormData()
      form.append('file', file)
      form.append('folder', 'upload/emailPdf')
      form.append('force', true)
      const res = await utilsApi.uploadAny(form)
      return res.file
    } catch {
      // pass
    }
  }

  const downloadPDF = async (fileName, info) => {
    await setPDF(element.value, info)
    await pdf.value.save(`${fileName}.pdf`)
  }

  return {
    setPDF,
    getPDF,
    downloadPDF,
    pdf,
  }
}

export default usePDF
