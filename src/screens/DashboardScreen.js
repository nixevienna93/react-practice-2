import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col, Alert, Table, Modal } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import Loader from '../components/Loader';
import axios from 'axios';

const DashboardScreen = ({ history }) => {

    // Get Logged In User
    const user = JSON.parse(localStorage.getItem("userInfo"))

    const [message, setMessage] = useState('')
    const [activeMakeAList, setActiveMakeAList] = useState(false)
    const [activeShowMyList, setActiveShowMyList] = useState(false)
    const [loading, setLoading] = useState(false)
    const [memes, setMemes] = useState([])
    const [selectedMemes, setSelectedMemes] = useState([])
    const [myLists, setMyLists] = useState([])

    // Make A List Handler
    const makeAList = (e) => {
        e.preventDefault()
        setActiveMakeAList(true)
        setActiveShowMyList(false)
        setMessage('')
    }

    // Show My List Handler
    const showMyList = (e) => {
        e.preventDefault()
        
        setActiveMakeAList(false)
        setActiveShowMyList(true)
        setMessage('')

        // Get Record By ID
        const mySavedLists = JSON.parse(localStorage.getItem("myLists")) || []

        const userLists = mySavedLists.find(o => (o.userId === user.id))

        if (userLists) {
            setMyLists(userLists.myLists)
        } else {
            setMyLists([])
        }
        
    }

    // Cancel Handler
    const cancelHandler = (e) => {
        e.preventDefault()
        setActiveMakeAList(false)
    }

    // Checkbox Handler
    const checkBoxHandler = (e) => {
        const val = String(e.target.value)
        const checked = e.target.checked
        const dataVal = JSON.parse(e.target.attributes.getNamedItem("data-value").value)
        const record = selectedMemes

        if (checked) {
            // Add To Record
            record.push(dataVal)
        } else {
            // // Remove record if exists
            const index = record.findIndex(o => (o.id === val))
            record.splice(index, 1)
        }

        setSelectedMemes(record)
    }

    // Save Meme Handler
    const saveMemeHandler = (e) => {
        e.preventDefault()
        e.stopPropagation()

        const val = e.target.attributes.getNamedItem("data-input-value").value
        const dataVal = JSON.parse(e.target.attributes.getNamedItem("data-value").value)
        const dataArr = []

        // Check if there are existing records from this user
        const savedMyLists = JSON.parse(localStorage.getItem("myLists")) || []
        const userHasLists = savedMyLists.findIndex(o => (o.userId === user.id))
        
        if (userHasLists > -1) {
            // Update record
            console.log('update record')
            savedMyLists[userHasLists].myLists.push(dataVal)
        } else {
            dataArr.push(dataVal)
            // Insert New Record
            console.log('insert new record')
            savedMyLists.push({ userId: user.id, myLists: dataArr })
        }

        // add to localstorage
        localStorage.setItem('myLists', JSON.stringify( savedMyLists ))

        // Show success message
        setMessage('Added to your list.')

        // Hide message after 3 seconds
        setTimeout( () => {
            setMessage('')
        }, 2000);

         // Reset Checkbox
         const checkboxes = document.querySelectorAll('input[type=checkbox]')

         checkboxes.forEach(checkbox => {
             checkbox.checked = false
         });
         
         // checkboxes.setAttribute('checked', false)
 
         // Reset selected memes
         setSelectedMemes([])
    }

    // Save Handler
    const saveHandler = (e) => {
        e.preventDefault()

        const record = JSON.parse(localStorage.getItem("myLists")) || []

        // Check if there are selected checkbox
        if (selectedMemes.length == 0) {
            alert('Please select at least one image.')
            return
        }

        // Check if there are existing records from this user
        const userHasLists = record.findIndex(o => (o.userId === user.id))

        if (userHasLists !== -1) {
            // Update record
            console.log('update record')
            record[userHasLists].myLists.push(...selectedMemes)
        } else {
            // Insert New Record
            console.log('insert new record')
            record.push({ userId: user.id, myLists: selectedMemes })
        }

        // add to localstorage
        localStorage.setItem('myLists', JSON.stringify( record ))

        // Show success message
        setMessage('Added to your list.')

        // Hide message after 3 seconds
        setTimeout( () => {
            setMessage('')
        }, 2000);

        // Reset Checkbox
        const checkboxes = document.querySelectorAll('input[type=checkbox]')

        checkboxes.forEach(checkbox => {
            checkbox.checked = false
        });
        
        // checkboxes.setAttribute('checked', false)

        // Reset selected memes
        setSelectedMemes([])
    }

    // Use Effect Handler
    useEffect(() => {
        // prevent unauthorized user
        if (!localStorage.getItem('userInfo')) {
            history.push('/login');
        }

        // Show loader
        setLoading(true)

        // Get 15 records only
        axios.get('https://api.imgflip.com/get_memes').then((response) => {
            const searchedMemes = response.data.data.memes
            const slicedMemes = searchedMemes.slice(0, 15);
            setMemes(slicedMemes)
            setLoading(false)
        });

    }, [])

    return (
        <>
            <div className='text-center mb-4'>
                <Button variant={ activeMakeAList ? 'primary' : 'dark' } onClick={makeAList}>Make a List</Button>
                <Button variant={ activeShowMyList ? 'primary' : 'dark' } onClick={showMyList}>Show My List</Button>
             </div>

             { loading && <Loader /> }

             {           
                ( memes.length > 0 ) ? (
                    <>
                    { activeMakeAList &&
                        <div className="text-right mb-3">
                            <Button variant="danger" onClick={cancelHandler}>Cancel</Button> 
                            <Button variant="info" onClick={saveHandler}>Save</Button>
                        </div>
                    }

                    { message && <Alert className='success-message' variant='success'>{message}</Alert> }

                    { activeMakeAList &&
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    { activeMakeAList && <th>&nbsp;</th> }
                                    <th>Sr no.</th>
                                    <th>Name</th>
                                    <th>Image</th>
                                </tr>
                            </thead>
                            <tbody>
                                {memes.map((meme) => (
                                    <tr>
                                        { activeMakeAList && 
                                        <td>
                                            <input type="checkbox"
                                                data-exist={ selectedMemes.find( o => o.id === meme.id ) ? 'yes' : 'no' }
                                                name='make-a-list[]' 
                                                data-value={JSON.stringify(meme)} 
                                                value={meme.id} 
                                                onChange={checkBoxHandler} 
                                            />
                                        </td> }
                                        <td className='pointer' onClick={saveMemeHandler} data-value={JSON.stringify(meme)} data-input-value={meme.id}>{ meme.id }</td>
                                        <td className='pointer' onClick={saveMemeHandler} data-value={JSON.stringify(meme)} data-input-value={meme.id}>{ meme.name }</td>
                                        <td className='pointer' onClick={saveMemeHandler} data-value={JSON.stringify(meme)} data-input-value={meme.id}><img onClick={saveMemeHandler} data-value={JSON.stringify(meme)} data-input-value={meme.id} width='300' height='300' src={ meme.url } alt={meme.name} className='meme-img' /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    }

                    { (activeShowMyList) ? (
                        (myLists.length > 0) ? (
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Sr no.</th>
                                        <th>Name</th>
                                        <th>Image</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {myLists.map((meme) => (
                                        <tr key={meme.id}>
                                            <td>{ meme.id }</td>
                                            <td>{ meme.name }</td>
                                            <td><img width='300' height='300' src={ meme.url } alt={meme.name} className='meme-img' /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        ) : (
                            <p className='text-center'>No saved lists.</p>
                        )
                        
                    ) : <></>
                    }
                    </>
                ) : (
                    <p>No record found</p>
                )
             }
        </>
    )
}

export default DashboardScreen
