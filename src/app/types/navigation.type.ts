interface Clipboard {
  writeText(newClipText: string): Promise<void>;
  readText(): Promise<string>;
  addEventListener(): any;
  removeEventListener(): any;
  dispatchEvent(): any;
}

interface NavigatorClipboard extends Navigator {
  readonly clipboard: Clipboard;

}
export interface NavigatorExtended extends NavigatorClipboard { }