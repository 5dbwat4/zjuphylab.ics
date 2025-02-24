
// We write so because we honor the origin source code in http://10.203.16.55:86/lab-course/static/js/app.ced592540260673b053f.js
// However such a code hates TypeScript so we extract it in a new file.
// Of course `(new Date()).getTime()` is better choice.

export const getTimestamp = () => Date.parse(new Date)