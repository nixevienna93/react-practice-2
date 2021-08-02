import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col, Alert } from 'react-bootstrap'
import users from '../users'

const LoginScreen = ({ history }) => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const validateForm = () => {
        return email.length > 0 && password.length > 0;
    }

    const submitHandler = (e) => {
        e.preventDefault()

        const login = (loginEmail, loginPassword) => {
            const isUserValid = users.find(o => (o.email === email && o.password === password));
            return isUserValid
        }

        const response = login(email, password)

        if (response) {
            localStorage.setItem('userInfo', JSON.stringify(response))
            history.push("/dashboard");
        } else {
            console.log('error')
            setError('Incorrect email or password.')
        }
    }

    useEffect(() => {
        if (localStorage.getItem('userInfo')) {
            history.push('/dashboard')
        }
    }, [])

    return (
        <>
            <Form className='login-form' onSubmit={submitHandler}>
                { error && <Alert variant='danger'>{ error }</Alert> }

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control autofocus type="email" value={email} placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" value={password} placeholder="Enter Password" onChange={(e) => setPassword(e.target.value)} />
                </Form.Group>
                
                <Button variant="primary" type="submit" disabled={!validateForm()}>
                    Login
                </Button>
            </Form>
        </>
    )
}

export default LoginScreen
