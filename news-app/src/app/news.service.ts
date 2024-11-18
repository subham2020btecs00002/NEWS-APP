import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private baseUrl = 'http://localhost:8088/search';

  constructor(private http: HttpClient) { }

  searchNews(query: string, page: number, pageSize: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}?query=${query}&page=${page}&pageSize=${pageSize}`);
  }
}
