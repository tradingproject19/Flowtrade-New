import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject, Subscription } from "rxjs";

/**
 * A custom Events service just like Ionic 3 Events https://ionicframework.com/docs/v3/api/util/Events/ which got removed in Ionic 5.
 *
 * @author Shashank Agrawal
 */
@Injectable({
    providedIn: 'root'
})
export class EventService {

    private channels: { [key: string]: BehaviorSubject<any>; } = {};

    /**
     * Subscribe to a topic and provide a single handler/observer.
     * @param topic The name of the topic to subscribe to.
     * @param observer The observer or callback function to listen when changes are published.
     *
     * @returns Subscription from which you can unsubscribe to release memory resources and to prevent memory leak.
     */
    subscribe(topic: string, observer: (_: any) => void): Subscription {
        if (!this.channels[topic]) {
            // You can also use ReplaySubject with one concequence
            this.channels[topic] = new BehaviorSubject<any>(null);
        }

        return this.channels[topic].subscribe(observer);
    }

    /**
     * Publish some data to the subscribers of the given topic.
     * @param topic The name of the topic to emit data to.
     * @param data data in any format to pass on.
     */
    publish(topic: string, data?: any): void {
      let subject = this.channels[topic];

      if (!subject) {
          // Create a new subject for the topic
          subject = new BehaviorSubject<any>(null);
          this.channels[topic] = subject;
      }

      subject.next(data);
    }

    /**
     * When you are sure that you are done with the topic and the subscribers no longer needs to listen to a particular topic, you can
     * destroy the observable of the topic using this method.
     * @param topic The name of the topic to destroy.
     */
    destroy(topic: string): null {
        const subject = this.channels[topic];
        if (!subject) {
            return null;
        }

        subject.complete();
        delete this.channels[topic];
        return null;
    }
}
