<template lang="pug">
#Basic
  .wrapper
    .topic
      .title
        i.el-icon-location 
        span 標題
      span 共分為六個層級，在文字前方加上不同數量的 
      span.highlight # 
      span 來做區別，
      span.highlight # 
      span 數量越少層級越高

      p.exp 範例↓
      .code
        p # 標題1
        p ## 標題2
        p ...
        p ###### 標題6
      
      p.exp 呈現結果↓
      .result
        p.h1 標題1
        p.h2 標題2
        p ...
        p.h6 標題6
    .topic
      .title
        i.el-icon-location 
        span 文字段落
      span 當沒加上任何符號時，該段文字就是文字段落區塊
      span 段落與段落之間保留一行空白空間，才接下一段的內容

      p.exp 範例↓
      .code
        p ## 標題
        p 這是一段文字段落
        br
        p 第二行的文字段落，互聯網提供瞭如今各種版本的 Lorem Ipsum 段落，或者大部分都多多少少出於刻意改寫其他偶爾的荒唐單詞而被篡改。
      
      p.exp 呈現結果↓
      .result
        p.h1 標題
        p 這是一段文字段落
        br
        p 第二行的文字段落，互聯網提供瞭如今各種版本的 Lorem Ipsum 段落，或者大部分都多多少少出於刻意改寫其他偶爾的荒唐單詞而被篡改。

    .topic
      .title
        i.el-icon-location 
        span 引言
      span 在文字前加上 
      span.highlight > 
      span 的符號即可，
      span 效果類似於email信件中的引言(也可以有階層)

      p.exp 範例↓
      .code
        p > 第一層--這裡有一段引用文字
        p >> 第二層--這裡有一段引用文字
        p >>> 第三層--這裡有一段引用文字
      
      p.exp 呈現結果↓
      .result
        p.quote 第一層--這裡有一段引用文字
          p.quote 第二層--這裡有一段引用文字
            p.quote 第三層--這裡有一段引用文字
    .topic
      .title
        i.el-icon-location 
        span 清單/列表
      span 包含有序及無序列表 
      li.list 無序
      span 在文字前加上 
      span.highlight -、+、*  
      span 的符號即可，若要表示下一個層級可多一個縮排
      p.exp 範例↓
      .code
        p  - 這是清單
        p  + 這也是清單
        p  * 這同樣是清單
        p  &ensp;&ensp;- 清單子項目
      p.exp 呈現結果↓
      .result
        li 這是清單
        li 這也是清單
        li 這同樣是清單
        ul &emsp;&emsp; ⚬ &ensp;清單子項目
      br
      li.list 有序
      span 使用 
      span.highlight 數字.
      span 表示
      p.exp 範例↓
      .code
        p  1. This is a 清單
        p  2. This is a 清單, too
        p  3. This is a 清單, too
      p.exp 呈現結果↓
      .result.numlist
        li This is a 清單
        li This is a 清單, too
        li This is a 清單, too
    .topic
      .title
        i.el-icon-location 
        span 區塊程式碼
      span 在開頭及結尾加上三個連續的反引號
      span.highlight `
      span 做為區塊的程式碼，且可以在首行的位置補上該段程式碼的語言類別

      p.exp 範例↓
      .code
        p ```typescript 
        p  interface User {
        p  &emsp;&emsp;name: string;
        p  &emsp;&emsp;id: number;
        p  }
        p ``` 
        
      p.exp 呈現結果↓
      .result
        p  interface User {
        p  &emsp;&emsp;name: string;
        p  &emsp;&emsp;id: number;
        p  }
    .topic
      .title
        i.el-icon-location 
        span 分隔線
      span 使用三個連續符號表示(
      span.highlight -、*
      span )

      p.exp 範例↓
      .code
        p 文字
        p ---
        p 也是文字
        
      p.exp 呈現結果↓
      .result
        p 文字
        .line
        p 也是文字
    .topic
      .title
        i.el-icon-location 
        span 表格
      span 使用符號 "畫" 一個表格，實際運用上並不是很方便，可用HTML 的表格標籤替代



      p.exp 範例↓
      .code
        p |column1 |column2 |column3 |
        p |----------|----------|----------|
        p |content1 |content2 |content3 |
        
      p.exp 呈現結果↓
      .result
        table.table
          tr.tr
            th column1 
            th column2
            th column3
          tr.tr
            td content1
            td content2
            td content3
    .topic
      .title
        i.el-icon-location 
        span 文字風格
      span 可設置斜體、粗體、刪除線，在文字間分別用
      span.highlight *
      span 、
      span.highlight **
      span 、
      span.highlight ~~
      span 包起來

      p.exp 範例↓
      .code
        p *斜體*
        p **粗體**
        p ~~刪除線~~
      p.exp 呈現結果↓
      .result
        p.italic 斜體
        p.bold 粗體
        p.dele 刪除線
    .topic
      .title
        i.el-icon-location 
        span 連結
      span 由
      span.highlight [ ]( )
      span 構成，
      span.highlight [ ]
      span 填連結的顯示文字
      span.highlight ( )
      span 則填入連結路徑

      p.exp 範例↓
      .code
        span  [Google](
        span#yellow https://www.google.com.tw/
        span )
      p.exp 呈現結果↓
      .result
        a() Google
    .topic
      .title
        i.el-icon-location 
        span 圖片
      span 由
      span.highlight ![ ]( )
      span 構成，
      span.highlight ![ ]
      span 非必填，其文字內容通常作為SEO條件，或圖片失效時顯示使用。
      span.highlight ( )
      span 圖片連結位置

      p.exp 範例↓
      .code
        span ![unsplash 圖片](
        span#yellow https://images.unsplash.com/photo-1625215081436-85323ed5042c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80
        span  )

      p.exp 呈現結果↓
      .result
        img(src="https://images.unsplash.com/photo-1625215081436-85323ed5042c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80")
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'Basic',
})
</script>

<style lang="sass" scoped>
#Basic
  margin-left: .5rem
</style>
