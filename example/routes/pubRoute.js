const { Router, Controller } = require('../../index');
const controller = Controller('pub');
const router = Router('pub');

router.put('/pub/list', controller.list);

router.put('/pub/detail', controller.detail);
// 添加用户
router.put('/pub/add', controller.add);

module.exports = router;
