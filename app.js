const express = require('express');
const multer = require('multer');
const fs = require('fs');
require('dotenv').config();

const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold
} = require('@google/generative-ai');
