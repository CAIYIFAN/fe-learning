### 1.git初始化一个项目到本地

克隆远端仓库：git clone + 远端git地址

切换到项目文件夹，执行存储密码：git config credential.helper.store

拉代码：git pull

### 2.git分支操作，并上传服务器

创建分支：git branch xxx

查看分支:  git branch -a

切换分支：git checkout xxx

创建并切换：git checkout -b xxx

将本地推送到远端：git push origin xxx:xxx

查看本地分支与远端分支：git branch -vv

将本地分支与远端分支关联：git branch --set-upstream-to=remotes/orign/xxx xxx

### 3.本地分支和远端分支关联

git branch --set-upstream-to=remotes/orign/xxx xxx ##关联分支

git push origin xxx:xxx 这样远程仓库也有一个dev分支了

git push origin :xxx

### 4.git查询系统配置

查看系统配置：

git config --system --list

配置当前用户:

git config --global user.name "myname"

git config --global user.email "test@gmail.com"

### 5.合并多次提交为一次提交

git rebase -i HEAD~4

该命令执行后，会弹出一个编辑窗口，4次提交的commit倒序排列，最上面的是最早的提交，最下面的是最后一次提交

修改第二行到第四行的第一个单词为squash

git add .

继续操作 git rebase --continue

放弃操作git rebase --abort

git  cherry-pick <commit id>

### 6.git合并并解决冲突

git merge + 分支名

解决冲突后

git add .

git status 

git rebase --continue

git push

### 7.git 操作分支

git branch 分支名

git checkout -b 分支名 【创建并切换分支】

git branch -d 分支名 【删除分支】

git merge 分支名 【合并版本】

git checkout 分支名 【切换分支名】

git push origin 本地分支：远端分支 【将本地分支和远端分支同时建立联系】

例子 git branch --set-upstream-to=remotes/origin/dev dev 【将本地分支与远端同时建立联系】

git cherry-pick 提交版本号 【当版本合并错误时，需要再合并】

### 8.git 常用操作

git tag 【显示已有的tag标签】

git tag +标签名 【新建标签名】

git tag -d + 标签名 【删除标签】

git stash 【将本地代码提交到暂存去】

git stash list 【查看本地暂存区的存放历史】

git stash pop 【将暂存区的记录弹出】

git branch -u 远端分支 【将当前分支与远端分支做关联】

git pull --rebase 【拉取线上版本】

git push 【将本地提交的代码推送到远端服务器】

git status 【查看当前发送变化文件】

git add  . 【增加文件到本地缓存区】

git reset HEAD --文件 【撤销本地缓存（add的反向操作）】

git commit -m 提交日志 【提交并添加日志到本地仓库】

git commit -am 提交日志 【新增并提交的命令】
git config --global user.name "你的名字或昵称" 【配置git用户名】

git config --global user.email "你的邮箱" 【配置用户的邮箱】

git branch -a 【查看所有分支】

git config credential.helper store 【存储密码】

git config --list 【查看git配置】

git branch -vv 【查看本地和远程对应关系】

git clone git地址 【克隆代码库到本地】

git status -s 【显示简单的修改列表】

git rm 文件 【删除文件】

git rm -f 文件 【删除文件】

git log -n 【查看n次提交的日志】

git log 【查看提交日志】

git checkout . 【撤销当前改变的代码】

git checkout {文件} 【撤销文件的改变的代码】

git revert {提交ID} 【还原指定版本的修改】

git reflow 【所有提交的log】

git rev-parse HEAD 【获取完整的commit id】

git rev-parse --short HEAD 【获取short commit id】

git fetch --all 【拉取所有远端的最新代码】



## git fetch和pull区别， git reset --soft 和 --hard区别

fetch 只能更新远程仓库的代码为最新的，本地仓库的代码还未被更新，我们需要通过 git merge origin/master 来合并这两个版本，你可以把它理解为合并分支一样的。

pull 操作是将本地仓库和远程仓库（本地的）更新到远程的最新版本。

如果想要更加可控一点的话推荐使用fetch + merge。

git reset –-soft：回退到某个版本，只回退了commit的信息，不会恢复到index file一级。如果还要提交，直接commit即可；
git reset -–hard：彻底回退到某个版本，本地的源码也会变为上一个版本的内容，撤销的commit中所包含的更改被冲掉；
