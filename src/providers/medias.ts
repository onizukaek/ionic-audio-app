/**
 * Created by hkb on 01.07.17.
 */
import { Injectable } from '@angular/core';
import { MediaPlugin, MediaObject} from '@ionic-native/media';

@Injectable()
export class MediasProvider {

  private file: MediaObject;

  constructor(private media: MediaPlugin) {

  }

  create(name: string) {
    //TODO: generate UUID or get title for filename
    let filename: string = name + '.m4a';
    this.file = this.media.create(filename, MediasProvider.onStatusUpdate, MediasProvider.onSuccess, MediasProvider.onError);
  }

  startRecord(){
    if(this.file) {
      this.file.startRecord();
    }
  }

  stopRecord(){
    if(this.file) {
      this.file.stopRecord();
      this.file.release();
    }
  }

  private static onStatusUpdate(status){
    console.log(status);
  }

  private static onSuccess() {
    console.log('Action is successful.');
  }

  private static onError(error) {
    console.error(error.message);
  }
}
