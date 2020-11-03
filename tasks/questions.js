const questions = [
  {
    type: 'input',
    name: 'access_token',
    message: "Please provide Phrase App access token",
    validate: function (value) {
      if (value.length > 0) {
        return true;
      }
      return 'Please enter a valid information';
    },
  },
  {
    type: 'input',
    name: 'project_id',
    message: "Please provide Phrase App Project ID",
    validate: function (value) {
      if (value.length > 0) {
        return true;
      }
      return 'Please enter a valid information';
    },
  },
  {
    type: 'input',
    name: 'locale_location',
    message: "Where do you want to keep the locale file",
    validate: function (value) {
      if (value.length > 0) {
        return true;
      }
      return 'Please enter a valid information';
    },
    default: function () {
      return './phraseapp/locales';
    },
  },
];

module.exports = questions;
