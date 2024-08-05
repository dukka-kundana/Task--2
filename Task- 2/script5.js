document.getElementById('resume-form').addEventListener('submit', function(event) {
    event.preventDefault();

    let resumeData = {
        name: document.getElementById('name').value,
        contact: document.getElementById('contact').value,
        linkedin: document.getElementById('linkedin').value,
        website: document.getElementById('website').value,
        summary: document.getElementById('summary').value,
        skills: document.getElementById('skills').value,
        education: document.getElementById('education').value,
        experience: document.getElementById('experience').value,
        projects: document.getElementById('projects').value,
        certifications: document.getElementById('certifications').value,
        languages: document.getElementById('languages').value,
        references: document.getElementById('references').value,
        template: document.getElementById('template').value,
        format: document.getElementById('format').value,
    };

    fetch('/generate-resume', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(resumeData)
    })
    .then(response => response.blob())
    .then(blob => {
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = url;
        a.download = `resume.${resumeData.format}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
    })
    .catch(error => console.error('Error:', error));
});
