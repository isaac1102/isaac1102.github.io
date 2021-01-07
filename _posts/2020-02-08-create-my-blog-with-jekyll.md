---
layout: post
title:  "Java8에 추가된 것들"
date:   2019-11-14 00:00:00
categories: TIL
tags: TIL JAVA
comments: true
---

* content
{:toc}

Java8에 추가된 것들에 대해 아~~주 간략히 키워드만 살펴보자!

## Optional
>- null인 객체를 처리하기 위한 클래스

## default 메소드
- 원래 interface를 구현하는 클래스에서는 interface에 있는 메소드를 모두 구현하여야 컴파일 오류가 발생하지 않는다.  
- 이와는 다르게 default를 사용하여 interface에 선언한 메소드는 필수가 아닌 선택적으로 구현여부를 정할 수 있다. 
- 이렇게 만든 이유는 과거에 만든 소스가 많은 개발자들에게 사용되는 상황에서 기존의 interface에 새로운 메소드를 추가해야하는 상황이
발생했기 때문이다. 기능 추가는 가능하되 컴파일 에러를 피할 수 있다. 

## Lambda
- 익명클래스 대용으로 사용하기 위해 만들어짐. 
=> 익명클래스는 뭔가? 클래스 상속이나 인터페이스 구현을 위한 클래스를 생성하지 않고도 , 단일 객체를 만들어서 상속하려는 클래스나 구현하려는 인터페이스에 정의된 동작에 행위를 추가할 수 있게 하는 클래스이다. 
- lambda는 메소드가 하나만 선언된 인터페이스에 대해서만 사용할 수 있다.
- 2개 이상 선언되면 컴파일 오류가 발생하는데, 이것을 방지하기 위해 @FunctionalInterface라는 어노테이션을 제공한다. 

## java.util.function 패키지
- predicate, Supplier, Consumer, Function, UnaryOperator, BinaryOperator


## Stream
- 연속된 정보를 처리하는 데 사용한다. 
- 기존에는 배열이나 컬렉션을 통해 연속된 정보를 사용해 왔다. 

스트림은 아래와 같은 기본구조를 가진다. 

### list.stream().filter(x-> x>10).count()

- .stream()  : 스트림을 생성한다. 
- .fileter() : 중개연산을 한다. 리턴값이 없다. 
- .count() : 종단 연산을 한다. 중개연산 작업 후에 마지막 종단연산 하고 리턴한다. 


스트림에서 제공하는 연산의 종류는 많다. 그중에서 많이 사용하는 것들은
.filter(), map(), forEach()정도가 있겠다.

### stream forEach()는 주어진 객체에서 루프를 돌면서 명령을 수행한다. 

### stream.map()
- map()메소드는 객체를 데이터로 바꾸는 것(x)
- 스트림의 값을 변환한다. 

### stream.filter()
- 말 그대로 조건에 맞는 데이터를 걸러내는 것이라고 생각하면 된다. 

## 메소드 참조(Method Reference)
더블콜론을 사용한다.
- static 메소드 참조( 클래스 내에 선언된 static 메소드를 참조할 수 있다. 클래스명::메소드명)
- 특정 객체의 인스턴스 메소드 참조 ( System 클래스의 out에 저장된 printStream의 객체를 참조하여 println()을 호출한다.)
- 특정 유형의 임의의 객체에 대한 인스턴스 메소드 참조(
- 생성자 참조 

