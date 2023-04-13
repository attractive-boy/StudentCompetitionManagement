import { Router } from 'express'
import dbConnect from '../utils/dbConnect'
import sendEmail from '../utils/mailSend'
import crypto from 'crypto'

const router = Router()

router.post('/', async (req, res) => {
    