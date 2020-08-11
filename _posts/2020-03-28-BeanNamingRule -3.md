---
layout: post
title:  "애너테이션 구성을 이용한 빈 명명 규칙(전문가를 위한 스프링 5)"
date:   2020-03-28 00:00:07
categories: SPRING
tags: IOC DI SPRING
---

* content
{:toc}

## 애너테이션 구성을 이용한 빈 명명 규칙

```
package com.ch3.annotated.namingRule;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class Singer {
	private String lyric = "We found a message in a bottle we were drinking";

	public void setLyric(@Value("I'm busted up but I'm loving every minute of it")String lyric) {
		this.lyric = lyric;
	}

	public void sing() {
		System.out.println(lyric);
	}
}
```
이 클래스에는 @Component 애너테이션을 적용한 Singer 타입의 싱글턴 빈 선언이 포함돼 있다. 
@Component애너테이션에는 인수가 없기 때문에 스프링 IoC컨테이너가 빈에 대한 식별자를 정하는데,
이 경우 클래스 자체로 빈을 명명하고 첫 번째 문자를 내림차순으로 처리한다. 

> 즉, singer(클래스명)이 빈 이름이 된다. 

결과값
>id : singer<br>
별칭 : []




### 빈의 이름을 다르게 지정하려는 경우
- @Component 애너테이션은 빈의 이름을 인수로 받아야 한다. 
```
package com.ch3.annotated.namingRule;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component("johnMayer")
public class Singer {
	private String lyric = "We found a message in a bottle we were drinking";

	public void setLyric(@Value("I'm busted up but I'm loving every minute of it")String lyric) {
		this.lyric = lyric;
	}

	public void sing() {
		System.out.println(lyric);
	}
}

```


결과값
>id : johnMayer<br>
별칭 : []
