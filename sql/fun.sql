truncate table zn_rights_var


set global log_bin_trust_function_creators = 1; -- 开启bin_log 复制 函数创建
DROP FUNCTION IF EXISTS hello; -- 删掉已经存在的
DELIMITER $$    -- 定义分隔符，必须要有，可以不是$$
CREATE FUNCTION hello( s varchar(30)) -- 多个参数用,分割 参数的类型必须是mysql列存在的类型
RETURNS VARCHAR(255)                  -- 指定返回值类型，如果你不确定返回文本长度，可以使用text
BEGIN
    DECLARE str varchar(255) default 'hello '; -- 定义一个变量，可以指定默认值
    SET str = concat(str,s);                    -- 设置改边变量的值
    RETURN str;                                 -- 返回值
END $$                                          -- 注意看清楚了，这个end后面有你在前面定义的分割符号
DELIMITER $$                                    -- 好，这里结束。



select * from `zn_rights_menu` where locate(',1,',parentPath)<>0;


DECLARE CONTINUE HANDLER FOR SQLSTATE '02000' SET _temp = NULL;

set global log_bin_trust_function_creators = 1; -- 开启bin_log 复制 函数创建
DROP FUNCTION IF EXISTS ZN_PARSE_VAR; -- 删掉已经存在的

DELIMITER $$
create function ZN_PARSE_VAR(var_id int(11))
RETURNS VARCHAR(50)
BEGIN
	DECLARE _temp varchar(50);
	select title INTO _temp from zn_rights_var where id=var_id;
	RETURN _temp;
END $$
