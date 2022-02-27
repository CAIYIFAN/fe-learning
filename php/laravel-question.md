---
title: Laravel:No application encryption key has been specified. 解决
date: 2021-02-16 00:32:16
tags: Laravel
---
- cp -a .env.example .env
- php artisan key:generate
- php artisan serve

