export function downloadCv() {
	const a = document.createElement('a');
	a.href = '/cv_en.pdf';
	a.download = 'curriculum_cesar_renteria.pdf';
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
}
