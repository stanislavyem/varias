const replace = require('replace-in-file');
const options = {
    //you may need to modify the file address to suite your project
    files: './out/_next/static/css/*.css',
    from: [
        '_next/static/media/Inter-Regular','_next/static/media/Inter-Regular','_next/static/media/Inter-Regular',
        '_next/static/media/Inter-SemiBold','_next/static/media/Inter-SemiBold','_next/static/media/Inter-SemiBold',
        '_next/static/media/Inter-Bold','_next/static/media/Inter-Bold','_next/static/media/Inter-Bold',
    ],
    to: [
        '../../../_next/static/media/Inter-Regular','../../../_next/static/media/Inter-Regular', '../../../_next/static/media/Inter-Regular',
        '../../../_next/static/media/Inter-SemiBold','../../../_next/static/media/Inter-SemiBold', '../../../_next/static/media/Inter-SemiBold',
        '../../../_next/static/media/Inter-Bold','../../../_next/static/media/Inter-Bold', '../../../_next/static/media/Inter-Bold',
    ],
};
(async function () {
    try {
        const results = await replace(options);
        console.log('Replacement results:', results);
    } catch (error) {
        console.error('Error occurred:', error);
    }
})();