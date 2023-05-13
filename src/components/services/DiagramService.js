export default class DiagramService {

    //_baseApi = 'http://62.113.104.25:4088/api';
    _baseApi = 'http://localhost:8000/api';
    _baseImage='https://starwars-visualguide.com/assets/img';
    getResource = async (url) => {
        const res = await fetch(this._baseApi + url);
        if (!res.ok){
            throw new Error(`Could not fetch ${url} \n return ${res.status}` );
        }
        return await res.json();
    };


     getAllDiagrams = async ()=> {
        const res = await this.getResource(`/diagrams/`);
         return res.results.map((el)=>{return this._transformDiagram(el)}).slice(0,5);
    };

     getDiagram = async(id) => {
        const res = await this.getResource(`/diagrams/${id}`);
        return this._transformDiagram(res);
    };



    _transformDiagram = (diagram) =>{
        return( {
            diagramId: diagram.id,
            diagramTitle: diagram.title,
            diagramAuthor: diagram.author,
            elements: diagram.elements
        });

    };

    _extractId = (item) => {
        const idRegExp = /\/([0-9]*)\/$/;
        return item.url.match(idRegExp)[1];
    };



}

