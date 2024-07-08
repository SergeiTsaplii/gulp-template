import notify from 'gulp-notify';

function plumberNotify(title) {
  return {
		errorHandler: notify.onError({
			title: title,
			message: 'Error <%= error.message %>',
			sound: false,
		}),
	};
};

export default plumberNotify;
