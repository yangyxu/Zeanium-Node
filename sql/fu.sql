set global log_bin_trust_function_creators = 1; -- 开启bin_log 复制 函数创建
DROP FUNCTION IF EXISTS ZN_CONVERT_USERS; -- 删掉已经存在的

DELIMITER $$
create function ZN_CONVERT_USERS($ids varchar(250))
	returns varchar(1000)
	begin
		declare $seeds varchar(1000) default ',';
		declare $seed varchar(100) default '';
		declare $id varchar(10);
		declare $splitIndex int;
		declare $len int;

		set $len = char_length($ids);
		while ($len>1)
			begin
				set $splitIndex = locate(',', $ids, 2);
				set $id = substring($ids, 2, $splitIndex - 2);
				set $ids = substring($ids, $splitIndex, ($len - $splitIndex + 1));
				select title into $seed from zn_rights_user where id=$id;
				if(char_length($seed)>=1)
					begin
						set $seeds = $seeds + $seed + ',';
					end
				set $len = char_length($ids);
			end

		return $seeds;
	end $$


select locate(',', ',1,4,5,', 2);

select char_length('ssss')


select char_length(',111,4,5,')
select locate(',', ',111,4,5,', 2);
select substring(',111,4,5,', 2, 5 - 2);

select substring(',111,4,5,', 5, (9 - 5 + 1));
