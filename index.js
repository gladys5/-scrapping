import { chromium } from "playwright"
// genera resultados de google
async function getResultsFromGoogle(query) {
  //inicializamos el navegador y abrimos la pestania
  const browser = await chromium.launch() //Este objeto se puede usar para iniciar o conectarse a Chromium, devolviendo instancias de [Navegador].
  const page = await browser.newPage() //Crea una nueva página en un nuevo contexto de navegador. Al cerrar esta página, también se cerrará el contexto.
  await page.goto("https://www.google.com/") //en donde se posicionara en caso de haber multiples direcciones utilizara la primera
  await page.waitForSelector("input[name='p']")
  await page.type("input[name='p']", query) //en donde se posicionara dentro de la pagina en este caso el input de busqueda
  page.keyboard.press("Enter")
  await page.waitForNavigation({ waitUntil: "networkidle" })
  const listResultados = await page.evaluate(() => {
    //colocamos evalue para salir de el contexto de node y utilizar el contexto del navegador para usar las apis
    let resultados = []
    document
      .querySelectorAll("div[data-header-feature]div a")
      .forEach((anchor, index) => {
        resultados.push({
          index: index,
          title: anchor.innerText,
          url: anchor.href,
        })
      })
    return resultados
  })
  console.log(listResultados)
  await browser.close()
  return listResultados
}
//vicitar resultados y extraer informacion
getResultsFromGoogle("node")
