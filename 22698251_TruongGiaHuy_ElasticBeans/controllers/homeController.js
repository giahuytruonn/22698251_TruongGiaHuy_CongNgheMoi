exports.getHome = (req, res) => {
    const studentInfo = {
        name: 'Truong Gia Huy',
        studentId: '22698251'
    };

    res.render('index', { studentInfo });
};
