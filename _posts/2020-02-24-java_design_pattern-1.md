---
layout: post
title:  "데코레이터 패턴"
date:   2020-02-14 00:00:00
categories: Design_Pattern
tags: Design_Pattern
---
 * content
{:toc}

## 데코레이터 패턴(Decorator Pattern)

데코레이터 패턴이 원본에 장식을 더하는 패턴이라는 것이 이름에 잘 드러나 있다.  
데코레이터 패턴은 프록시 패턴과 구현 방법이 같다. 다만 프록시 패턴은 클라이언트가 최종적으로 돌려받는 반환값을 조작하지 않고 그대로 전달하는 반면 데코레이터 패턴은 클라이언트가 받는 반환값에 장식을 덧입힌다. 

<table>
	<tr>
		<th rowspan="2" style="background-color: #e5eaed;border-bottom: 1px solid black;">프록시 패턴</th>
		<td>
			제어의 흐름을 변경하거나 별도의 로직 처리를 목적으로 한다.
		</td>
	</tr>
	<tr style="border-bottom: 1px solid black;">
		<td>
			클라이언트가 받는 반환값을 특별한 경우가 아니면 변경하지 않는다.
		</td>
	</tr>
	<tr>
		<th style="background-color: #e5eaed;">데코레이터 패턴</th>
		<td>클라이언트가 받는 반환값에 장식을 한다.</td>
	</tr>
</table>
### 프록시 패턴
- 제어의 흐름을 변경하거나 별도의 로직 처리를 목적으로 한다.
- 클라이언트가 받는 반환값을 특별한 경우가 아니면 변경하지 않는다.

### 데코레이터 패턴
- 클라이언트가 받는 반환값에 장식을 더한다. 

IService.java
```
package decoratorPattern;

public interface IService{
	public abstract String runSomething();
}
```
<br>
IService 인터페이스를 구현한 Service.java
```
package decoratorPattern;

public class Service implements IService{
	public String runSomething(){
		return "서비스 짱!!";
	}
}
```
<br>
IService 인터페이스를 구현한 Decorator.java
```
package decoratorPattern;

public class Decorator implements IService{
	IService service;
	
	public String runSomething(){
		System.out.println("호출에 대한 장식 주목적, 클라이언트에게 반환 결과에 장식을 더하며 전달");
		service = new Service();
		return "정말" + service.runSomething();
	}
	
}
```
<br>
데코레이터를 사용하는 ClientWithDecorator.java
```
package decoratorPattern;

public class ClientWithDecorator{
	public class void main(String[] args){
		IService decorator = new Decorator();
		System.out.println(decorator.runSomething());
	}
}
```

<br>

## 데코레이터 패턴의 중요 포인트
 - 장식자는 실제 서비스와 같은 이름의 메서드를 구현한다. 이때 인터페이스를 사용한다.
- 장식자는 실제 서비스에 대한 참조 변수를 갖는다(합성).
- 장식자는 실제 서비스의 같은 이름을 가진 메서드를 호출하고, 그 반환값에 장식을 더해 클라이언트에게 돌려준다. 
- 장식자는 실제 서비스의 메서드 호출 전후에 별도의 로직을 수행할 수도 있다. 
<br>

### 한마디로 정리하자면,
> 메서드 호출의 반환값에 변화를 주기 위해 중간에 장식자를 두는 패턴

이라고 할 수 있다.



