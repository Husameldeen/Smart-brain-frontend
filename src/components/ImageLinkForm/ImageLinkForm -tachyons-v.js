import './ImageLinkForm.css'

const ImageLinkForm = ({dispatch, onButtonSubmit}) => {
    return (
        <div className='ma4 mt0'>
            <p className='f2'>
                {`This Magic Brain will detect faces in your images, Give it a try`}
            </p>
            <div className='center'>
                <div className='form center pa4 br3 shadow-5'>
                    <input 
                    className='f4 pa2 w-70 center' 
                    type='text' 
                    onChange={(e) => dispatch({type: 'setInput', payload: e.target.value})}
                    />
                    <button 
                    className='w-30 grow f4 link ph3 pv2 dib white bg-light-purple'
                    onClick={onButtonSubmit}
                    >Detect</button>
                </div>
            </div>
        </div>
    )
}

export default ImageLinkForm;