import React, { useState, useEffect } from 'react';
import { Form, Table, Button, Modal, Row, Col } from 'react-bootstrap'
import Loader from '../components/Loader';
import axios from 'axios'

const MemesScreen = () => {

    const [memes, setMemes] = useState([])
    const [hasTyped, setHasTyped] = useState(false)
    const [loading, setLoading] = useState(false)
    const [show, setShow] = useState(false);
    const [yourImg, setYourImg] = useState('')
    const [topText, setTopText] = useState('')
    const [topTextSize, setTopTextSize] = useState('16')
    const [topTextColor, setTopTextColor] = useState('red')
    const [bottomText, setBottomText] = useState('')
    const [bottomTextSize, setBottomTextSize] = useState('16')
    const [bottomTextColor, setBottomTextColor] = useState('red')

    const handleClose = () => setShow(false);
    
    // Search Handler
    const onChangeHandler = (e) => {
        const val = e.target.value.toLowerCase()

        setLoading(true)

        axios.get('https://api.imgflip.com/get_memes').then((response) => {

            if (val !== '') {
                const searchedMemes = response.data.data.memes
                const tempMemes = searchedMemes.filter((meme) => meme.name.toLowerCase().includes(val))
                console.log(tempMemes)
                setMemes(tempMemes)
                setHasTyped(true)
                setLoading(false)
            } else {
                setMemes([]);
                setHasTyped(false)
                setLoading(false)
            }
            
        });
    }

    // Random Pick Handler
    const randomPickHandler = (e) => {
        setLoading(true)

        axios.get('https://api.imgflip.com/get_memes').then((response) => {

            const selected = []

            const data = response.data.data.memes

            const count = data.length

            const randomNum = parseInt(Math.floor((Math.random() * count)))

            const tempMemes = data[randomNum]

            selected.push(tempMemes)

            setHasTyped(true)

            setMemes(selected)

            setLoading(false)
            
        });
    }

    // Image Popup Modal Handler
    const handleShow = (e) => {
        const val = e.target.src
        setYourImg(val)
        setShow(true)
    }

    // Submit handler
    const submitHandler = (e) => {
        e.preventDefault()
        
        // Reset all values
        setTopText('')
        setBottomText('')

        // Close Popup
        setShow(false)
    }

    useEffect(() => {
        axios.get('https://api.imgflip.com/get_memes').then((response) => {
            setMemes(response.data.data.memes);
        });
    }, [])

    return (
        <>
            <h1>Images</h1>

            <Row>
                <Col>
                    <Form.Control className='searchMeme mb-3' type="text" placeholder="Search images..." onChange={onChangeHandler} />
                </Col>
                <Col>
                    <Button variant="primary" onClick={randomPickHandler}>
                        Random Pick
                    </Button>
                </Col>
            </Row>
            

            { loading && <Loader /> }

            { 
                ( hasTyped ) ? (                     
                    ( memes.length > 0 ) ? (
                        
                        <>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Sr no.</th>
                                    <th>Name</th>
                                    <th>Image</th>
                                </tr>
                            </thead>
                            <tbody>
                                {memes.map((meme) => (
                                    <tr key={meme.id}>
                                        <td>{ meme.id }</td>
                                        <td>{ meme.name }</td>
                                        <td><img width='300' height='300' src={ meme.url } alt={meme.name} className='meme-img' onClick={handleShow} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        
                        <Modal show={show} onHide={handleClose}>
                            <Modal.Header closeButton>
                            <Modal.Title>Your Meme</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>

                                <div className='your-meme-img mb-3'>
                                    { topText && <div className='meme-img-top-text' style={{fontSize: topTextSize+'px', color: topTextColor }}>{ topText }</div> }
                                    { <img src={yourImg} /> }
                                    { bottomText && <div className='meme-img-bottom-text' style={{fontSize: bottomTextSize+'px', color: bottomTextColor }}>{ bottomText }</div> }
                                </div>

                                <Form onSubmit={submitHandler}>
                                    <Form.Group className="mb-3">
                                        <Row>
                                            <Col>
                                                <Form.Label>Top Text:</Form.Label>
                                                <Form.Control type="text" onChange={(e) => setTopText(e.target.value)} placeholder="Enter top text" />
                                            </Col>
                                            <Col>
                                                <Form.Label>Font Size:</Form.Label>
                                                <div className='mb-3'>
                                                    <select onChange={(e) => setTopTextSize(e.target.value)}>
                                                        <option value="16">16</option>
                                                        <option value="18">18</option>
                                                        <option value="20">20</option>
                                                        <option value="22">22</option>
                                                    </select>
                                                </div>

                                                <Form.Label>Color:</Form.Label>
                                                <Form.Check
                                                    type="radio"
                                                    label="Red"
                                                    name="topTextColor"
                                                    id="topTextColorRed"
                                                    value="red"
                                                    onChange={(e) => setTopTextColor(e.target.value)} 
                                                />
                                                <Form.Check
                                                    type="radio"
                                                    label="Blue"
                                                    name="topTextColor"
                                                    id="topTextColorBlue"
                                                    value="blue"
                                                    onChange={(e) => setTopTextColor(e.target.value)} 
                                                />
                                                <Form.Check
                                                    type="radio"
                                                    label="Green"
                                                    name="topTextColor"
                                                    id="topTextColorGreen"
                                                    value="green"
                                                    onChange={(e) => setTopTextColor(e.target.value)} 
                                                />
                                            </Col>
                                        </Row>
                                        
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="formBasicPassword">
                                        <Row>
                                            <Col>
                                                <Form.Label>Bottom Text:</Form.Label>
                                                <Form.Control type="text" onChange={(e) => setBottomText(e.target.value)} placeholder="Enter Bottom Text" />
                                            </Col>
                                            <Col>
                                            <Col>
                                                <Form.Label>Font Size:</Form.Label>
                                                    <div className='mb-3'>
                                                        <select onChange={(e) => setBottomTextSize(e.target.value)}>
                                                            <option value="16">16</option>
                                                            <option value="18">18</option>
                                                            <option value="20">20</option>
                                                            <option value="22">22</option>
                                                        </select>
                                                    </div>

                                                    <Form.Label>Color:</Form.Label>
                                                    <Form.Check
                                                        type="radio"
                                                        label="Red"
                                                        name="bottomTextColor"
                                                        id="bottomTextColorRed"
                                                        value="red"
                                                        onChange={(e) => setBottomTextColor(e.target.value)} 
                                                    />
                                                    <Form.Check
                                                        type="radio"
                                                        label="Blue"
                                                        name="bottomTextColor"
                                                        id="bottomTextColorBlue"
                                                        value="blue"
                                                        onChange={(e) => setBottomTextColor(e.target.value)} 
                                                    />
                                                    <Form.Check
                                                        type="radio"
                                                        label="Green"
                                                        name="bottomTextColor"
                                                        id="bottomTextColorGreen"
                                                        value="green"
                                                        onChange={(e) => setBottomTextColor(e.target.value)} 
                                                    />
                                                </Col>
                                            </Col>
                                        </Row>
                                    </Form.Group>

                                    <Button variant="primary" type="submit">
                                        Apply
                                    </Button>
                                </Form>
                            </Modal.Body>
                            {/* <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={handleClose}>
                                Save Changes
                            </Button>
                            </Modal.Footer> */}
                        </Modal>
                        </>

                    ) : (
                        <p>No record found</p>
                    )
                )
                :
                (<p>Please type any keyword.</p>)
             }
        </>
    )
}

export default MemesScreen