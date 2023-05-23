import {useState} from 'react'
import { Worker } from '@react-pdf-viewer/core';
import { Viewer } from '@react-pdf-viewer/core';
// Импорт стилей
import '@react-pdf-viewer/core/lib/styles/index.css';
// Пакет плагина
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
// Стили плагина
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

function App() {

  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const [pdfFile, setPdfFile]=useState(null);
  const [pdfError, setPdfError]=useState('');

  //let alltext = []; // Массив для хранения всего извлечённого текста

  const allowedFiles = ['application/pdf'];

  const [dragEnter, setDragEnter] = useState(false)

  const handleFile = (e) =>{
    let selectedFile = e.target.files[0];
    if(selectedFile){
      if(selectedFile&&allowedFiles.includes(selectedFile.type)){
        let reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onloadend=(e)=>{
          setPdfError('');
          setPdfFile(e.target.result);
        }
      }
      else{
        setPdfError('Недопустимый PDF-файл: Пожалуйста, выберите только PDF-файл.');
        setPdfFile('');
      }
    }
    else{
      console.log('Пожалуйста, выберите PDF-файл.');
    }
  }
  function dragEnterHandler(event){
    event.preventDefault()
    event.stopPropagation()
    setDragEnter(true)
  }

  function dragLeaveHandler(event){
    event.preventDefault()
    event.stopPropagation()
    setDragEnter(false)
  }

//Извлечение текста из пдф

  return ( !dragEnter ?
    <div className="container" onDragEnter ={dragEnterHandler} onDragLeave ={dragLeaveHandler} onDragOver={dragEnterHandler}>
      <form>
       <label><h5>Upload PDF</h5></label>   {/*Кнопка для загрузки файла */}
        <br></br>
        <input type='file' className="form-control"
        onChange={handleFile}>
        
        </input>
        {/*ошибка при выборе не пдф */}
        {pdfError&&<span className='text-danger'>{pdfError}</span>}

      </form>
      {/* Кнопка для посмотра файла */}
      <h5>View PDF</h5>
      <div className="viewer">

        {/* При получение пдф файла выполняется его открытие */}
        {pdfFile&&(
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
            <Viewer fileUrl={pdfFile}
            plugins={[defaultLayoutPluginInstance]}></Viewer>
          </Worker>
        )}

        {/* показать содержимое файла  */}
        {!pdfFile&&<>No file is selected yet</>}
        {/* запись текста файла в массив  */}


      </div>
    </div> 
    :  
    <div className = "drop-area" /*onDrop = {dropHandler}*/ onDragEnter ={dragEnterHandler} onDragLeave ={dragLeaveHandler} onDragOver={dragEnterHandler}>  {/*Для drad and drop */}
      Перетащите файлы сюда
       {/*ошибка при выборе не пдф */}
       {pdfError&&<span className='text-danger'>{pdfError}</span>}
    </div>

  );
}

export default App;
