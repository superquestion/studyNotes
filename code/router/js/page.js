var config = {};
config.domain = "http://localhost:63342/router/";
config.isTest = true;
router('/user/:id', userController);
router.start();

