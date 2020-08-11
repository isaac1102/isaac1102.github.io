---
layout: post
title:  "스프링 입문을 위한 자바 객체지향의 원리와 이해 - 1"
date:   2020-02-08 00:00:00
categories: Book
tags: java spring
mathjax: true
---

객체 지향 설계 5원칙 - SOLID

SRP(Single Responsibility Principle) : 단일 책임 원리    
OCP(Open Closed Principle) : 개방 폐쇄 원칙     
LSP(Liskov Substition Principle) : 리스코프 치환 원칙    
ISP(Interface Sergregation Principle) : 인터페이스 분리 원칙    
DIP(Dependency Inversion Principle) : 의존 역전 원칙
	
1. SRP - 단일 책임의 원칙

>"어떤 클래스를 변경해야 하는 이유는 오직 하나뿐이어야 한다." -로버트 C.마틴  
 
<br>
![](/../img/uml1.jpg)
<br>

좋지않은 예. 
역할과 책임이 너무 많아서 피곤을 유발한다. 
 

이런 경우에 역할(책임)을 분리하라는 것이 단일 책임 원칙이다.

<br>
<br>
![](/../img/uml2.jpg)

남자라는 하나의 클래스가 역할과 책임에 따라 네 개의 클래스로 쪼개진 것을 볼 수 있다. 
>단일 책임 원칙은 속성, 메서드, 패키지, 모듈, 컴포넌트, 프레임워크 등에도 적용할수 있는 개념이다.

<br>
<br>
<br>

2. LSP - 리스코프 치환 법칙

>"서브 타입은 언제나 자신의 기반타입(base type)으로 교체할 수 있어야 한다." -로버트 C.마틴

객체 지향의 상속은 다음의 조건을 만족해야 한다. 
- 하위클래스 is a kind of 상위 클래스 - 하위 분류는 상위 분류의 한 종류이다.
- 구현클래스 is able to 인터페이스 - 구현 분류는 인터페이스할 수 있어야 한다. 

위 두 개의 문장대로 구현된 프로그램이라면 리스코프 치환 원칙을 잘 지키는 것.