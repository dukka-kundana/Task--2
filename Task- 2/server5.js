const express = require('express');
const bodyParser = require('body-parser');
const htmlPdf = require('html-pdf');
const docx = require('docx');
const fs = require('fs');
const path = require('path');
const app = express(); 

const templates = {
    template1: fs.readFileSync(path.join(__dirname, 'template1.html'), 'utf8'),
    template2: fs.readFileSync(path.join(__dirname, 'template2.html'), 'utf8')
};

app.use(bodyParser.json());
app.use(express.static(__dirname));

app.post('/generate-resume', (req, res) => {
    const resumeData = req.body;
    const template = templates[resumeData.template];
    const resumeHtml = template
        .replace('{{name}}', resumeData.name)
        .replace('{{contact}}', resumeData.contact)
        .replace('{{linkedin}}', resumeData.linkedin)
        .replace('{{website}}', resumeData.website)
        .replace('{{summary}}', resumeData.summary)
        .replace('{{skills}}', resumeData.skills)
        .replace('{{education}}', resumeData.education)
        .replace('{{experience}}', resumeData.experience)
        .replace('{{projects}}', resumeData.projects)
        .replace('{{certifications}}', resumeData.certifications)
        .replace('{{languages}}', resumeData.languages)
        .replace('{{references}}', resumeData.references);

    if (resumeData.format === 'pdf') {
        htmlPdf.create(resumeHtml).toBuffer((err, buffer) => {
            if (err) {
                console.error('Error generating PDF:', err);
                return res.status(500).send('Error generating PDF');
            }
            res.setHeader('Content-Type', 'application/pdf');
            res.send(buffer);
        });
    } else if (resumeData.format === 'docx') {
        const doc = new docx.Document();
        doc.addSection({
            children: [
                new docx.Paragraph({
                    text: resumeHtml,
                    heading: docx.HeadingLevel.HEADING_1
                })
            ]
        });
        docx.Packer.toBuffer(doc).then(buffer => {
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
            res.send(buffer);
        }).catch(err => {
            console.error('Error generating DOCX:', err);
            res.status(500).send('Error generating DOCX');
        });
    } else if (resumeData.format === 'txt') {
        res.setHeader('Content-Type', 'text/plain');
        res.send(resumeHtml);
    } else {
        res.status(400).send('Unsupported format');
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
