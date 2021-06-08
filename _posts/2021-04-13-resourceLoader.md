---
layout: post
title:  "스프링은 어떻게 설정파일(context)를 읽어올까?"
date:   2021-04-13 00:00:00
categories: SPRING
tags: SPRING RESOURCELOADER
---
&nbsp;스프링 어플리케이션이 실행되는 시점에 여러가지 설정정보를 읽어와서 부트스트랩(bootstrap)한다는 것은 알고 있었다. XML파일의 어딘가에 선언해두면 스프링이 오브젝트 생성을 하고,, 의존관계를 형성해서 주입하고 등등의 두루뭉술한 설명이 가능했다. 하지만 이정도 이해로는 많은 부족함이 있기 때문에, 이 부분에 대한 궁금증을 이 글을 통해서 정리하면서 해소해보고자 한다.  
이 글은 스프링의 bootstrap과정을 모두 설명하는 것이 아니라, 스프링을 통해 Resource 오브젝트와 그것을 로드하는 Resource Loader을 설명하는 글이다.  
<br>  
<strong>Resource는 문자열 안에 리소스의 종류와 리소스의 위치를 함께 표현하게 해준다. 그리고 이렇게 문자열로 정의된 리소스는 Resource Loader를 통해 실제 Resource 타입 오브젝트로 변환된다.</strong>  
<br>
리소스 로더가 처리하는 대표적 접두어들은 다음과 같다.   
<br>


|접두어|예|설명|
|---|:---:|---|
| file: |file:/C:/temp/file.txt|파일 시스템의 구조앞에 file: 접두어를 붙였다|
|classpath|classpath:file.txt|클래스패스 루트에 존재하는 file.txt리소스에 접근한다.|
|없음|WEB-INF/test.dat|접두어가 없는 경우 리소스 로더 구현에 따라 리소스 위치가 결정된다. ServletResourceLoader라면 서블릿 컨텍스트의 루트를 기준으로 해석한다.|
|http:|http://www.myserver.com/test.dat|HTTP프로토콜을 사용해 접근할 수 있는 웹상의 리소스를 지정한다. ftp:도 사용가능하다.|




<br>   
   
&nbsp;스프링 컨테이너는 리소스 로더를 다양한 목적으로 사용한다. 그 대표적인 예로 스프링의 application context이다. applicationContext는 리소스 로더 인터페이스를 구현했으며, 모든 어플리케이션 컨텍스트는 리소스 로더이기도 하다. 스프링이 읽는 대부분의 XML파일은 리소스 로더를 사용하며 외부에서 읽어오는 모든 정보 또한 리소스 로더를 사용한다.    
<br>	
