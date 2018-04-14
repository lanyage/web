/** 添加测试一级菜单 */
INSERT INTO `mesdb`.`basicinfo_menu1` (`code`, `name`) VALUES ('11', '一级菜单1');
INSERT INTO `mesdb`.`basicinfo_menu1` (`code`, `name`) VALUES ('12', '一级菜单2');
INSERT INTO `mesdb`.`basicinfo_menu1` (`code`, `name`) VALUES ('13', '一级菜单3');
INSERT INTO `mesdb`.`basicinfo_menu1` (`code`, `name`) VALUES ('14', '一级菜单4');
INSERT INTO `mesdb`.`basicinfo_menu1` (`code`, `name`) VALUES ('15', '一级菜单5');
INSERT INTO `mesdb`.`basicinfo_menu1` (`code`, `name`) VALUES ('16', '一级菜单6');
INSERT INTO `mesdb`.`basicinfo_menu1` (`code`, `name`) VALUES ('17', '一级菜单7');

/** 添加测试二级菜单 */
INSERT INTO `mesdb`.`basicinfo_menu2` (`code`, `name`) VALUES ('28', '测试二级菜单1');
INSERT INTO `mesdb`.`basicinfo_menu2` (`code`, `name`) VALUES ('29', '测试二级菜单2');
INSERT INTO `mesdb`.`basicinfo_menu2` (`code`, `name`) VALUES ('30', '测试二级菜单3');
INSERT INTO `mesdb`.`basicinfo_menu2` (`code`, `name`) VALUES ('31', '测试二级菜单4');
INSERT INTO `mesdb`.`basicinfo_menu2` (`code`, `name`) VALUES ('32', '测试二级菜单5');
INSERT INTO `mesdb`.`basicinfo_menu2` (`code`, `name`) VALUES ('33', '测试二级菜单6');
INSERT INTO `mesdb`.`basicinfo_menu2` (`code`, `name`) VALUES ('34', '测试二级菜单7');

UPDATE `mesdb`.`basicinfo_menu2` SET `menu1_code`='11' WHERE `code`='28';
UPDATE `mesdb`.`basicinfo_menu2` SET `menu1_code`='12' WHERE `code`='29';
UPDATE `mesdb`.`basicinfo_menu2` SET `menu1_code`='13' WHERE `code`='30';
UPDATE `mesdb`.`basicinfo_menu2` SET `menu1_code`='14' WHERE `code`='31';
UPDATE `mesdb`.`basicinfo_menu2` SET `menu1_code`='15' WHERE `code`='32';
UPDATE `mesdb`.`basicinfo_menu2` SET `menu1_code`='16' WHERE `code`='33';
UPDATE `mesdb`.`basicinfo_menu2` SET `menu1_code`='17' WHERE `code`='34';

/** 添加测试三级菜单*/
INSERT INTO `mesdb`.`permission_model` (`code`, `name`, `menu2_code`, `menu1_code`) VALUES ('87', '测试菜单1', '28', '11');
INSERT INTO `mesdb`.`permission_model` (`code`, `name`, `menu2_code`, `menu1_code`) VALUES ('88', '测试菜单2', '29', '12');
INSERT INTO `mesdb`.`permission_model` (`code`, `name`, `menu2_code`, `menu1_code`) VALUES ('89', '测试菜单3', '30', '13');
INSERT INTO `mesdb`.`permission_model` (`code`, `name`, `menu2_code`, `menu1_code`) VALUES ('90', '测试菜单4', '31', '14');
INSERT INTO `mesdb`.`permission_model` (`code`, `name`, `menu2_code`, `menu1_code`) VALUES ('91', '测试菜单5', '32', '15');
INSERT INTO `mesdb`.`permission_model` (`code`, `name`, `menu2_code`, `menu1_code`) VALUES ('92', '测试菜单6', '33', '16');
INSERT INTO `mesdb`.`permission_model` (`code`, `name`, `menu2_code`, `menu1_code`) VALUES ('93', '测试菜单7', '34', '17');

INSERT INTO `mesdb`.`permission_model` (`code`, `name`, `menu2_code`, `menu1_code`) VALUES ('94', '测试菜单1', '28', '11');
INSERT INTO `mesdb`.`permission_model` (`code`, `name`, `menu2_code`, `menu1_code`) VALUES ('95', '测试菜单2', '29', '12');
INSERT INTO `mesdb`.`permission_model` (`code`, `name`, `menu2_code`, `menu1_code`) VALUES ('96', '测试菜单3', '30', '13');
INSERT INTO `mesdb`.`permission_model` (`code`, `name`, `menu2_code`, `menu1_code`) VALUES ('97', '测试菜单4', '31', '14');
INSERT INTO `mesdb`.`permission_model` (`code`, `name`, `menu2_code`, `menu1_code`) VALUES ('98', '测试菜单5', '32', '15');
INSERT INTO `mesdb`.`permission_model` (`code`, `name`, `menu2_code`, `menu1_code`) VALUES ('99', '测试菜单6', '33', '16');
INSERT INTO `mesdb`.`permission_model` (`code`, `name`, `menu2_code`, `menu1_code`) VALUES ('100', '测试菜单7', '34', '17');